{
  config,
  lib,
  pkgs,
  ...
}:

let
  inherit (lib)
    concatMapAttrs
    filterAttrs
    listToAttrs
    mapAttrs'
    mapAttrsToList
    mkEnableOption
    mkIf
    mkOption
    nameValuePair
    types
    ;

  cfg = config.services.h2-site;
  enabledInstances = filterAttrs (_: inst: inst.enable) cfg;

  instanceOptions =
    { name, ... }:
    {
      options = {
        enable = mkEnableOption "H2 Site instance: ${name}";

        domains = mkOption {
          type = types.listOf types.str;
          default = [ ];
          description = "Public domain names for the application.";
        };

        package = mkOption {
          type = types.nullOr types.package;
          default = null;
          defaultText = lib.literalExpression "pkgs.h2-site";
          description = "The H2 site package to use.";
        };
      };
    };
in
{
  options.services.h2-site = mkOption {
    type = types.attrsOf (types.submodule instanceOptions);
    default = { };
    description = "Declarative multi-instance H2 site service configuration.";
  };

  config = mkIf (enabledInstances != { }) {
    services.h3-forms = mapAttrs' (
      name: inst:
      nameValuePair name {
        enable = true;
      }
    ) enabledInstances;

    users.users.caddy.extraGroups = mapAttrsToList (
      name: _: config.services.h3-forms.${name}.group
    ) enabledInstances;

    services.caddy = {
      enable = true;

      virtualHosts = concatMapAttrs (
        name: inst:
        let
          package = if inst.package != null then inst.package else pkgs.h2-site;

          vhostConfig = {
            extraConfig = ''
              root * "${package}/share/h2-site"
              encode gzip zstd

              handle /_form/* {
                reverse_proxy unix/${config.services.h3-forms.${name}.socketPath}
              }

              handle {
                try_files {path} {path}/ /index.html
                file_server
              }

              log {
                output file /var/log/caddy/access.log
              }
            '';
          };
        in
        listToAttrs (map (domain: nameValuePair domain vhostConfig) inst.domains)
      ) enabledInstances;
    };
  };
}

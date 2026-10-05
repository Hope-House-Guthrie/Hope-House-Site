{
  config,
  lib,
  pkgs,
  ...
}:

let
  inherit (lib)
    filterAttrs
    mapAttrs'
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

        domain = mkOption {
          type = types.str;
          description = "Public URL for the application.";
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
    services.caddy = {
      enable = true;

      virtualHosts = mapAttrs' (
        name: inst:
        let
          package = if inst.package != null then inst.package else pkgs.h2-site;
        in
        nameValuePair inst.domain {
          extraConfig = ''
            root * "${package}/bin"
            encode gzip zstd

            handle {
              try_files {path} {path}/ /index.html
              file_server
            }

            log {
              output file /var/log/caddy/access.log
            }
          '';
        }
      ) enabledInstances;
    };
  };
}

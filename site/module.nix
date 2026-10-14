{
  h2-site,
}:
{
  hostingEnvironment,
}:
{
  config,
  lib,
  ...
}:

let
  inherit (lib)
    listToAttrs
    mkEnableOption
    mkIf
    mkOption
    nameValuePair
    types
    ;

  cfg = config.services.h2-site.${hostingEnvironment};
in
{
  options.services.h2-site.${hostingEnvironment} = {
    enable = mkEnableOption "H2 Site instance: ${hostingEnvironment}";

    domains = mkOption {
      type = types.listOf types.str;
      default = [ ];
      description = "Public domain names for the application.";
    };
  };

  config = mkIf (cfg.enable) {
    users.users.caddy.extraGroups = [
      config.services.h3-forms.${hostingEnvironment}.group
    ];

    services.caddy = {
      enable = true;

      virtualHosts =
        let
          vhostConfig = {
            extraConfig = ''
              root * "${h2-site}/share/h2-site"
              encode gzip zstd

              handle /_form/* {
                reverse_proxy unix/${config.services.h3-forms.${hostingEnvironment}.socketPath}
              }

              handle {
                @notfound {
                  not file {path} {path}/ {path}/index.html
                }
                error @notfound 404

                file_server
              }

              handle_errors {
                @404 expression `{err.status_code} == 404`
                handle @404 {
                  rewrite * /404
                  file_server
                }
              }

              log {
                output file /var/log/caddy/access.log
              }
            '';
          };
        in
        listToAttrs (map (domain: nameValuePair domain vhostConfig) cfg.domains);
    };
  };
}

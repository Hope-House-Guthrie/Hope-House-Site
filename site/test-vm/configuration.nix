{
  i18n.defaultLocale = "en_US.UTF-8";
  networking.hostName = "test";
  system.stateVersion = "26.05";

  users = {
    mutableUsers = false;
    users.root.password = "root";
  };

  services.h2-site.test = {
    enable = true;
    domains = [
      "localhost"
    ];
  };
}

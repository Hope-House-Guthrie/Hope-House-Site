{
  description = "Hope House Site";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-26.05";

    h3 = {
      url = "github:Hope-House-Guthrie/HopeHouseHub/develop";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      ...
    }@inputs:
    let
      system = "x86_64-linux";

      pkgs = import inputs.nixpkgs {
        inherit system;
      };

      devShell = pkgs.callPackage ./shell/package.nix {
        inherit inputs;
      };

      h2-site = pkgs.callPackage ./site/package.nix {
        inherit inputs;

        version = "0.1.0";
      };

      module = (import ./site/module.nix { inherit h2-site; });

      nixosModules = {
        h2-site = module;
        default = module;
      };
    in
    {
      devShells.${system}.default = devShell;

      nixosConfigurations.test-vm = inputs.nixpkgs.lib.nixosSystem {
        inherit system;

        modules = [
          ./site/test-vm
          (inputs.h3.nixosModules.h3-forms { hostingEnvironment = "test"; })
          (nixosModules.h2-site { hostingEnvironment = "test"; })
        ];
      };

      inherit nixosModules;

      packages.${system}.default = h2-site;
    };
}

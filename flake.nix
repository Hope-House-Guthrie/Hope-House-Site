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
      self,
      ...
    }@inputs:
    let
      system = "x86_64-linux";

      pkgs = import inputs.nixpkgs {
        inherit system;
        overlays = [ self.overlays.default ];
      };

      shell = pkgs.callPackage ./shell/package.nix {
        inherit inputs;
      };

      module = ./site/module.nix;
    in
    {
      devShells.${system}.default = shell;

      nixosConfigurations.test-vm = inputs.nixpkgs.lib.nixosSystem {
        inherit system;

        modules = [
          ./site/test-vm
          inputs.h3.nixosModules.h3-forms
          {
            nixpkgs.overlays = [
              self.overlays.default
              inputs.h3.overlays.default
            ];
          }
        ];
      };

      nixosModules = {
        h2-site = module;
        default = module;
      };

      overlays.default = final: prev: {
        h2-site = final.callPackage ./site/package.nix {
          inherit inputs;

          version = "0.1.0";
        };
      };

      packages.${system}.default = pkgs.h2-site;
    };
}

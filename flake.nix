{
  description = "Hope House Site";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-26.05";
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
          {
            nixpkgs.overlays = [ self.overlays.default ];
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

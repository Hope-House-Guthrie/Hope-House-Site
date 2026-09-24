{
  description = "Hope House Site";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-26.05";

    bun2nix = {
      url = "github:nix-community/bun2nix?ref=2.1.2";
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

      shell = pkgs.callPackage ./shell/package.nix {
        inherit inputs;
      };

      site = pkgs.callPackage ./site/package.nix {
        inherit inputs;

        version = "0.1.0";
      };
    in
    {
      devShells.${system}.default = shell;
      packages.${system}.default = site;

    };
}

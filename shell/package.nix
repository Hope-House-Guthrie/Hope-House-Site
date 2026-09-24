{
  inputs,
  pkgs,
  stdenv,
  ...
}:
let
  system = stdenv.hostPlatform.system;
  bun2nix = inputs.bun2nix.packages.${system}.default;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    bun
    bun2nix
    nixd
    nixfmt
    starship
  ];

  shellHook = ''
    eval "$(starship init bash)"
  '';
}

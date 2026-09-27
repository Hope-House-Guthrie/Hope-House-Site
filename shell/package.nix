{
  pkgs,
  ...
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    nixd
    nixfmt
    nodejs_24
    pnpm_11
    starship
  ];

  shellHook = ''
    eval "$(starship init bash)"
  '';
}

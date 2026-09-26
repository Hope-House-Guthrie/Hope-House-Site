{
  pkgs,
  ...
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    nixd
    nixfmt
    nodejs
    pnpm
    starship
  ];

  shellHook = ''
    eval "$(starship init bash)"
  '';
}

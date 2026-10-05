{
  pkgs,
  ...
}:
let
  run-test-vm = pkgs.writeShellScriptBin "run-test-vm" ''
    nix build .#nixosConfigurations.test-vm.config.system.build.vm && ./result/bin/run-test-vm
  '';
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    nixd
    nixfmt
    nodejs_24
    pnpm_11
    run-test-vm
    starship
  ];

  shellHook = ''
    eval "$(starship init bash)"
  '';
}

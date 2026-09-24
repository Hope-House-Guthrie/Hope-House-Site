{
  inputs,
  stdenv,
  version,
  ...
}:
let
  system = stdenv.hostPlatform.system;
  bun2nix = inputs.bun2nix.packages.${system}.default;
in
stdenv.mkDerivation {
  inherit version;

  pname = "h2site";
  src = ./src;

  nativeBuildInputs = [
    bun2nix.hook
  ];

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

  postUnpack = ''

  '';

  buildPhase = ''
    bun run build
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp -R ./dist/* $out/bin
  '';
}

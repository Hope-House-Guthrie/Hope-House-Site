{
  pkgs,
  stdenv,
  version,
  ...
}:
stdenv.mkDerivation rec {
  inherit version;

  pname = "h2site";
  src = ./.;

  nativeBuildInputs = [
    pkgs.nodejs
    pkgs.pnpm
    pkgs.pnpmConfigHook
  ];

  pnpmDeps = pkgs.fetchPnpmDeps {
    inherit pname version src;
    fetcherVersion = 4;
    hash = "sha256-Dft+VdFyFoL8d37O04Zo5GyNZ8KiL0F4fZeSJfDVigc=";
  };

  postUnpack = ''

  '';

  buildPhase = ''
    pnpm build
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp -R ./dist/* $out/bin
  '';
}

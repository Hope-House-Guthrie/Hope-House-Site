{
  pkgs,
  stdenv,
  version,
  ...
}:
stdenv.mkDerivation rec {
  inherit version;

  pname = "h2-site";
  src = ./.;

  nativeBuildInputs = [
    pkgs.nodejs
    pkgs.pnpm
    pkgs.pnpmConfigHook
  ];

  pnpmDeps = pkgs.fetchPnpmDeps {
    inherit pname version src;
    fetcherVersion = 4;
    hash = "sha256-wrWLoV3YszyU1VDdip2MRC7XmN/xEUlyNGz3ctzKhZs=";
  };

  postUnpack = ''

  '';

  buildPhase = ''
    pnpm build
  '';

  installPhase = ''
    mkdir -p $out/share/h2-site
    cp -R ./dist/* $out/share/h2-site
  '';
}

// geoincra-portal/src/utils/geo.js

/**
 * Converte coordenadas nos formatos:
 * - Graus Minutos Segundos (DMS)
 * - Decimal com direção (S, N, E, O)
 * - Decimal padrão
 *
 * Retorna número decimal ou null
 */
export function parseCoordinate(input) {
  if (!input) return null;

  const value = input.trim();

  // 1️⃣ Decimal puro
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return parseFloat(value);
  }

  // 2️⃣ Decimal + direção (S, N, E, O)
  const decDir = value.match(/^(\d+(\.\d+)?)\s*([NSEO])$/i);
  if (decDir) {
    let num = parseFloat(decDir[1]);
    const dir = decDir[3].toUpperCase();
    if (dir === "S" || dir === "O") num *= -1;
    return num;
  }

  // 3️⃣ Graus, Minutos e Segundos (DMS)
  const dms = value.match(
    /(\d+)[°º]\s*(\d+)?['’]?\s*(\d+(?:[.,]\d+)?)?["”]?\s*([NSEO])/i
  );

  if (dms) {
    const graus = parseFloat(dms[1]);
    const minutos = parseFloat(dms[2] || 0);
    const segundos = parseFloat((dms[3] || "0").replace(",", "."));
    const direcao = dms[4].toUpperCase();

    let decimal = graus + minutos / 60 + segundos / 3600;
    if (direcao === "S" || direcao === "O") decimal *= -1;

    return parseFloat(decimal.toFixed(6));
  }

  return null;
}
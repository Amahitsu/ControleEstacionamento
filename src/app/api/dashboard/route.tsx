import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const {} = new URL(req.url);

    const totalVeiculosEstacionadosResult = await sql`
      SELECT COUNT(*) AS "totalEstacionados"
      FROM "cupom"
      WHERE "dataHoraSaida" IS NULL;
    `;

    const veiculosPorTipoResult = await sql`
      SELECT tv."veiculo" AS "tipoVeiculo", COUNT(*) AS "quantidade"
      FROM "cupom" c
      JOIN "placa" p ON p.id = c."placaID"
      JOIN "tipoVeiculo" tv ON tv.id = p."tipoVeiculoId"
      WHERE c."dataHoraSaida" IS NULL
      GROUP BY tv."veiculo";
    `;

    const totalAReceberPorTipoResult = await sql`
      SELECT tv."veiculo" AS "tipoVeiculo", SUM(t."valor") AS "totalAReceber"
      FROM "cupom" c
      JOIN "placa" p ON p.id = c."placaID"
      JOIN "tipoVeiculo" tv ON tv.id = p."tipoVeiculoId"
      JOIN "tarifas" t ON t."tipoVeiculoId" = tv.id
      WHERE c."dataHoraSaida" IS NULL
      GROUP BY tv."veiculo";
    `;

    const totalVeiculosEstacionados =
      totalVeiculosEstacionadosResult.rows[0]?.totalEstacionados ?? 0;

    const veiculosPorTipo = veiculosPorTipoResult.rows.map((row) => ({
      tipoVeiculo: row.tipoVeiculo,
      quantidade: row.quantidade,
    }));

    const totalAReceberPorTipo = totalAReceberPorTipoResult.rows.map((row) => ({
      tipoVeiculo: row.tipoVeiculo,
      totalAReceber: row.totalAReceber,
    }));

    return NextResponse.json(
      {
        data: {
          totalVeiculosEstacionados,
          veiculosPorTipo,
          totalAReceberPorTipo,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no GET do Dashboard:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

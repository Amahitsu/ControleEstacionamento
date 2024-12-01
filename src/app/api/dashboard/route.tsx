import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const {} = new URL(req.url);
    
    // Obter a contagem de cupons abertos (sem hora de saída)
    const cuponsAbertosResult = await sql`
      SELECT COUNT(*) AS "cuponsAbertos"
      FROM "cupom"
      WHERE "dataHoraSaida" IS NULL;
    `;
    
    // Obter a contagem total de cupons (todos)
    const cuponsTotalResult = await sql`
      SELECT COUNT(*) AS "cuponsTotal"
      FROM "cupom";
    `;

    // Obter todas as tarifas
    const tarifasResult = await sql`
      SELECT 
        tv."id" AS "tipoVeiculoId", 
        tv."veiculo" AS "tipoVeiculo", 
        t."valor"
      FROM "tipoVeiculo" tv
      JOIN "tarifa" t ON t."tipoVeiculoId" = tv."id";
    `;
    
    // Verificar se há resultados
    if (!cuponsAbertosResult.rows || !cuponsTotalResult.rows || !tarifasResult.rows) {
      throw new Error("Erro ao recuperar dados do banco.");
    }

    // Organizar as informações para retorno
    const cuponsAbertos = cuponsAbertosResult.rows[0]?.cuponsAbertos ?? 0;
    const cuponsTotal = cuponsTotalResult.rows[0]?.cuponsTotal ?? 0;
    const tarifas = tarifasResult.rows.map(row => ({
      tipoVeiculo: row.tipoVeiculo,
      valor: row.valor
    }));

    // Retornar as informações de cupons e tarifas
    return NextResponse.json(
      { data: { cuponsAbertos, cuponsTotal, tarifas } },
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

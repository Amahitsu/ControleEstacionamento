import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Obter o parâmetro "placa" da URL
    //const { searchParams } = new URL(req.url);

    // Se o parâmetro "placa" foi fornecido, adicionar a cláusula WHERE com segurança
    const result = await sql`
          SELECT 
              c.id AS "id",
              c."dataHoraEntrada",
              c."dataHoraSaida",
              c."valorTotal",
              p."placa" AS "placa",
              tv."id" AS "idTipoVeiculo",
              tv."veiculo" AS "tipoVeiculo",
              m."nomeModelo" AS "modelo"
          FROM 
              "cupom" c
          JOIN 
              "placa" p ON p.id = c."placaID"
          JOIN 
              "tipoVeiculo" tv ON tv.id = p."tipoVeiculoId"
          JOIN
              "modelo" m ON m.id = p."modeloId"
          WHERE
              c."dataHoraSaida" IS NOT NULL
          ORDER BY
              c."dataHoraSaida" DESC;
        `;

    // Acessar `rows` do resultado e verificar se há registros
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Nenhum registro encontrado para a placa especificada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Erro no GET:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
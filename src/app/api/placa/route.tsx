// src/app/api/placa/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } = await sql`SELECT * FROM "placa"`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar placas:", error);
    return NextResponse.json(
      { message: "Erro ao buscar placas", error: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const {
      placa,
      modeloId: modeloNome,
      tipoVeiculoId: tipoVeiculoNome,
      cor,
    } = await request.json();

    console.log("Dados recebidos para adicionar placa:", {
      placa,
      modeloNome,
      tipoVeiculoNome,
      cor,
    });

    const modeloResult =
      await sql`SELECT id FROM modelo WHERE "nomeModelo" = ${modeloNome}`;
    if (modeloResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Modelo não encontrado." },
        { status: 404 }
      );
    }
    const modeloId = modeloResult.rows[0].id;

    const tipoVeiculoResult =
      await sql`SELECT id FROM "tipoVeiculo" WHERE "veiculo" = ${tipoVeiculoNome}`;
    if (tipoVeiculoResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Tipo de veículo não encontrado." },
        { status: 404 }
      );
    }
    const tipoVeiculoId = tipoVeiculoResult.rows[0].id;

    const { rows, rowCount } = await sql`
            INSERT INTO placa ("placa", "modeloId", "tipoVeiculoId", "cor")
            VALUES (${placa}, ${modeloId}, ${tipoVeiculoId}, ${cor})
            RETURNING *
        `;

    if (rowCount === 0) {
      console.error("Nenhuma linha inserida na tabela.");
      return NextResponse.json(
        { message: "Nenhuma placa foi adicionada." },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: rows }, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar placa:", error);
    return NextResponse.json(
      { message: "Erro ao adicionar a placa", error: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID não fornecido." },
        { status: 400 }
      );
    }

    const { rowCount } = await sql`
            DELETE FROM placa WHERE id = ${id}
        `;

    if (rowCount === 0) {
      return NextResponse.json(
        { message: "Placa não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Placa excluída com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir placa:", error);
    return NextResponse.json(
      { message: "Erro ao excluir a placa", error: error },
      { status: 500 }
    );
  }
}

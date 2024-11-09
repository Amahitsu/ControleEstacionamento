import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
      const { rows } = await sql`SELECT * FROM "tarifas"`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
      console.error('Erro ao buscar tarifas:', error);
      return NextResponse.json({ message: 'Erro ao buscar tarifas', error: error }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Extrair os dados do corpo da requisição
    const { horaCobrada, tipoVeiculo, valor } = await request.json();

    // Validação simples para evitar que campos obrigatórios estejam vazios
    if (!horaCobrada || !tipoVeiculo || valor === undefined) {
      return NextResponse.json(
        { message: "Campos faltando ou inválidos" },
        { status: 400 }
      );
    }

    // Consultar o ID do tipo de veículo pelo nome
    const tipoVeiculoResult = await sql`
      SELECT id FROM "tipoVeiculo" WHERE "veiculo" = ${tipoVeiculo}
    `;
    if (tipoVeiculoResult.rowCount === 0) {
      return NextResponse.json({ message: "Tipo de veículo não encontrado." }, { status: 404 });
    }
    const tipoVeiculoId = tipoVeiculoResult.rows[0].id;

    // Formatação para garantir que `valor` seja numérico
    const valorNumerico = parseFloat(valor);

    // Executar a consulta SQL para inserir os dados
    const { rows } = await sql`
      INSERT INTO tarifas ("horaCobrada", "tipoVeiculoId", "valor")
      VALUES (${horaCobrada}, ${tipoVeiculoId}, ${valorNumerico})
      RETURNING *;
    `;

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: unknown) {
    // Captura o erro e exibe uma mensagem detalhada
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao adicionar tarifa:", errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const { id, horaCobrada, tipoVeiculoId, valor } = await request.json();

    const { rows } = await sql`
      UPDATE tarifas
      SET horaCobrada = ${horaCobrada}, tipoVeiculoId = ${tipoVeiculoId}, valor = ${valor}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ data: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json();

    const result = await sql`
      DELETE FROM tarifas
      WHERE id = ${id}
    `;

    if (result?.rowCount && result.rowCount > 0) {
      return NextResponse.json({ message: 'Tarifa deletada com sucesso!' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Tarifa não encontrada' }, { status: 404 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ message: 'Erro ao deletar a tarifa', error: errorMessage }, { status: 500 });
  }
}

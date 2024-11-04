// src/app/api/placa/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export async function GET(): Promise<NextResponse> {
    try {
        const { rows } = await sql`SELECT * FROM "placa"`;
        return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar placas:', error);
        return NextResponse.json({ message: 'Erro ao buscar placas', error: error }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { placa, modeloId, tipoVeiculoId, cor } = await request.json();

        // Verifique se os dados foram recebidos corretamente
        console.log('Dados recebidos para adicionar placa:', { placa, modeloId, tipoVeiculoId, cor });

        const { rows, rowCount } = await sql`
            INSERT INTO "placa" (placa, modeloId, tipoVeiculoId, cor)
            VALUES (${placa}, ${modeloId}, ${tipoVeiculoId}, ${cor})
            RETURNING *;
        `;

        if (rowCount === 0) {
            console.error('Nenhuma linha inserida na tabela.');
            return NextResponse.json({ message: 'Nenhuma placa foi adicionada.' }, { status: 400 });
        }

        return NextResponse.json({ data: rows }, { status: 201 });
    } catch (error) {
        console.error('Erro ao adicionar placa:', error);
        return NextResponse.json({ message: 'Erro ao adicionar a placa', error: error }, { status: 500 });
    }
}

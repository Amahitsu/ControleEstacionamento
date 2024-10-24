-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;


DROP TABLE IF EXISTS public.cupom;

CREATE TABLE IF NOT EXISTS public.cupom
(
    id bigserial NOT NULL,
    "dataHoraEntrada" time without time zone NOT NULL,
    "dataHoraSaida" timestamp without time zone,
    descricao character varying(100),
    "valorTotal" numeric(10, 2),
    "placaID" bigserial,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.tarifas;

CREATE TABLE IF NOT EXISTS public.tarifas
(
    id bigserial NOT NULL,
    hora timestamp without time zone NOT NULL,
    "tipoVeiculoId" bigserial NOT NULL,
    valor numeric(10, 2),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public."tipoVeiculo";

CREATE TABLE IF NOT EXISTS public."tipoVeiculo"
(
    id bigserial NOT NULL,
    veiculo character varying(10) NOT NULL
);

DROP TABLE IF EXISTS public.placa;

CREATE TABLE IF NOT EXISTS public.placa
(
    id bigserial NOT NULL,
    "modeloId" bigserial,
    placa character varying(7) NOT NULL,
    "tipoVeiculoId" bigserial,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.modelo;

CREATE TABLE IF NOT EXISTS public.modelo
(
    id bigserial NOT NULL,
    "nomeModelo" character varying(50),
    PRIMARY KEY (id)
);
END;
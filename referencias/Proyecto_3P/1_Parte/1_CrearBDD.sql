-- =====================================================
-- 01_create_database.sql
-- Base de datos transaccional EcoWrapped
-- =====================================================

IF DB_ID('EcoWrappedDB') IS NOT NULL
BEGIN
    ALTER DATABASE EcoWrappedDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE EcoWrappedDB;
END;
GO

CREATE DATABASE EcoWrappedDB;
GO

ALTER DATABASE EcoWrappedDB SET RECOVERY SIMPLE;
GO

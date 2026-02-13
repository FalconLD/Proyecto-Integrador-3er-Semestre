SELECT 
    name AS TriggerName,
    is_disabled
FROM sys.triggers
WHERE name = 'trg_Reciclaje_AuditOutbox';

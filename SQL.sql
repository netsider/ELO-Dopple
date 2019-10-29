IF NOT EXISTS 
    (   SELECT  1
        FROM    dopplesets 
        WHERE   Softwarename = @SoftwareName 
        AND     SoftwareSystemType = @Softwaretype
    )
    BEGIN
        INSERT tblSoftwareTitles (SoftwareName, SoftwareSystemType) 
        VALUES (@SoftwareName, @SoftwareType) 
    END;
	
-- https://stackoverflow.com/questions/17991479/insert-values-where-not-exists

IF NOT EXISTS (SELECT  1 FROM $table WHERE name = @SoftwareName) BEGIN INSERT tblSoftwareTitles (SoftwareName, SoftwareSystemType) VALUES (@SoftwareName, @SoftwareType) END;
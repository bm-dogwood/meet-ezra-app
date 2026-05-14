from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_api_storeta_store_i_target_idx_api_storeta_store_i_985653_idx'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AlterField(
                    model_name='store',
                    name='external_code',
                    field=models.CharField(blank=True, max_length=100, null=True, unique=True),
                ),
            ],
            database_operations=[
                migrations.RunSQL(
                    sql="""
                    DO $$
                    BEGIN
                        IF NOT EXISTS (
                            SELECT 1 FROM pg_constraint 
                            WHERE conname = 'api_store_external_code_aa556c95_uniq'
                        ) THEN
                            ALTER TABLE api_store ADD CONSTRAINT api_store_external_code_aa556c95_uniq UNIQUE (external_code);
                        END IF;
                    END $$;
                    """,
                    reverse_sql="ALTER TABLE api_store DROP CONSTRAINT IF EXISTS api_store_external_code_aa556c95_uniq;",
                ),
            ],
        ),
    ]

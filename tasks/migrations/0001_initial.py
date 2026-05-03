from django.db import migrations, models # type: ignore


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_ID', models.CharField(max_length=50, unique=True)),
                ('task_title', models.CharField(max_length=200)),
                ('teacher_name', models.CharField(max_length=100)),
                ('subject', models.CharField(max_length=100)),
                ('grade', models.CharField(max_length=50)),
                ('priority', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium', max_length=10)),
                ('description', models.TextField()),
                ('created_by', models.CharField(max_length=100)),
                ('status', models.CharField(default='Pending', max_length=50)),
            ],
            options={
                'ordering': ['task_ID'],
            },
        ),
    ]

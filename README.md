# AI-Whatsapp
# InstructGPT
Los modelos de instrucción están optimizados para seguir instrucciones de un solo turno. Ada es el modelo más rápido, mientras que Davinci es el más poderoso. 
Ada|Babbage|Curie|Davinci
---|---|---|---
$0.0004 / 1K tokens|$0.0005 / 1K tokens|$0.0020 / 1K tokens|$0.0200 / 1K tokens
# Fine-tuning models
Crea modelos propios personalizados ajustando los modelos base con datos de entrenamiento. Una vez que se ajuste un modelo, se facturará solo por los tokens que use en las solicitudes a ese modelo. (4 veces los tokens de entrenamiento)
Model|Training|Usage
---|---|---
Ada	|$0.0004 / 1K tokens	|$0.0016 / 1K tokens
Babbage	|$0.0006 / 1K tokens	|$0.0024 / 1K tokens
Curie	|$0.0030 / 1K tokens	|$0.0120 / 1K tokens
Davinci	|$0.0300 / 1K tokens	|$0.1200 / 1K tokens
## Introducción
Fine-tuning mejora el aprendizaje en pocos `shot` mediante la capacitación en muchos más ejemplos, lo que le permite lograr mejores resultados. Una vez que se ha ajustado un modelo, ya no necesitará proporcionar ejemplos en el indicador. Esto ahorra costos y permite solicitudes de menor latencia.

A un alto nivel, el ajuste fino implica los siguientes pasos:
- Prepare and upload training data
- Train a new fine-tuned model
- Use your fine-tuned model
Fine-tuning is currently only available for the following base models: `davinci`, `curie`, `babbage`, and `ada`.
## Preparar datos de entrenamiento
Los datos deben ser un documento `JSONL`, donde cada línea es un par de `prompt` y `completion` correspondiente a un ejemplo de capacitación. Puede utilizar la [herramienta de preparación de datos CLI](https://platform.openai.com/docs/guides/fine-tuning/cli-data-preparation-tool) para convertir fácilmente sus datos a este formato de archivo.
```sh
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
...
```
Cuantos más ejemplos de entrenamiento mejor. Se recomienda tener al menos un par de cientos de ejemplos. En general, cada vez que se duplica el tamaño del conjunto de datos, se produce un aumento lineal en la calidad del modelo.


[Fine-Tuning OpenAI without Code! Full Breakdown & Best Practices
](https://youtu.be/c07eWV6Pois)
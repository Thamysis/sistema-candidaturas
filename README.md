# Sistema de Candidaturas

Protótipo web local baseado nos três arquivos PDF da pasta. O fluxo disponível é cadastro → informações pessoais → anexo do currículo.

## Visualizar

Na pasta do projeto, execute:

```powershell
python -m http.server 8000
```

Depois acesse http://localhost:8000 no navegador.

O progresso do formulário é salvo no navegador. O upload aceita arquivos PDF, DOC ou DOCX com menos de 2 MB. As ações que apontariam para telas fora dos três protótipos permanecem nesta interface.

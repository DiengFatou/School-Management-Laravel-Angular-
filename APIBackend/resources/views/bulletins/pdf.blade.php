<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bulletin Scolaire - {{ $bulletin->eleve->nom }} {{ $bulletin->eleve->prenom }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 10px;
        }
        .school-info {
            margin-bottom: 20px;
        }
        .student-info {
            margin-bottom: 30px;
        }
        .student-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .student-info th, .student-info td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .student-info th {
            background-color: #f2f2f2;
            width: 30%;
        }
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .grades-table th, .grades-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }
        .grades-table th {
            background-color: #f2f2f2;
        }
        .summary {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .signature {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature div {
            width: 45%;
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 10px;
            margin-top: 40px;
        }
        .mention {
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background-color: #e9f7fe;
            border-left: 4px solid #1e88e5;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="school-info">
            <h2>ÉTABLISSEMENT SCOLAIRE</h2>
            <h3>BULLETIN DE NOTES</h3>
            <p>Année Scolaire: {{ $bulletin->anneeScolaire->annee }}</p>
            <p>Trimestre: {{ $bulletin->trimestre }}</p>
        </div>
    </div>

    <div class="student-info">
        <table>
            <tr>
                <th>Nom et Prénom</th>
                <td>{{ $bulletin->eleve->nom }} {{ $bulletin->eleve->prenom }}</td>
            </tr>
            <tr>
                <th>Date de Naissance</th>
                <td>{{ \Carbon\Carbon::parse($bulletin->eleve->date_naissance)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <th>Classe</th>
                <td>{{ $bulletin->eleve->classe->nom ?? 'Non spécifiée' }}</td>
            </tr>
            <tr>
                <th>Date d'édition</th>
                <td>{{ \Carbon\Carbon::parse($bulletin->date_generation)->format('d/m/Y') }}</td>
            </tr>
        </table>
    </div>

    <h3>Résultats Scolaires</h3>
    <table class="grades-table">
        <thead>
            <tr>
                <th>Matières</th>
                <th>Coefficient</th>
                <th>Notes</th>
                <th>Moyenne Classe</th>
                <th>Appréciation</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalPoints = 0;
                $totalCoefficients = 0;
            @endphp
            
            @foreach($bulletin->notes as $note)
                @php
                    $totalPoints += $note->pivot->moyenne * $note->coefficient;
                    $totalCoefficients += $note->coefficient;
                @endphp
                <tr>
                    <td>{{ $note->nom }}</td>
                    <td>{{ $note->coefficient }}</td>
                    <td>{{ number_format($note->pivot->moyenne, 2, ',', ' ') }}</td>
                    <td>{{ number_format($note->pivot->moyenne_classe, 2, ',', ' ') }}</td>
                    <td>{{ $note->pivot->appreciation }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div style="display: flex; justify-content: space-between;">
            <div>
                <p><strong>Moyenne Générale:</strong> {{ number_format($bulletin->moyenne_generale, 2, ',', ' ') }}/20</p>
                <p><strong>Rang:</strong> {{ $bulletin->rang }}<sup>e</sup> sur {{ $bulletin->eleve->classe->eleves->count() ?? '?' }}</p>
            </div>
            <div>
                <p><strong>Mentions:</strong> {{ $bulletin->mention }}</p>
                <p><strong>Décision du conseil de classe:</strong> {{ $bulletin->decision }}</p>
            </div>
        </div>
    </div>

    <div class="mention">
        <p>Appréciation générale: {{ $bulletin->appreciation }}</p>
    </div>

    <div class="signature">
        <div>
            Le Chef d'Établissement<br><br>
            ..................................
        </div>
        <div>
            Le Professeur Principal<br><br>
            ..................................
        </div>
    </div>

    <div class="footer">
        <p>Établissement Scolaire - Tous droits réservés © {{ date('Y') }}</p>
        <p>Ce document est généré automatiquement, il ne nécessite pas de cachet ni de signature manuscrite.</p>
    </div>
</body>
</html>

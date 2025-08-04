<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bulletin Scolaire - {{ $bulletin->eleve->nom }} {{ $bulletin->eleve->prenom }}</title>
    <style>
        @page { 
            margin: 0.5cm;
            size: A4;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            line-height: 1.2;
            color: #333;
            margin: 0;
            padding: 5px;
        }
        .header {
            text-align: center;
            margin-bottom: 5px;
            padding-bottom: 5px;
        }
        .header h1 {
            font-size: 14px;
            margin: 0 0 5px 0;
            padding: 0;
        }
        .header h2, .header h3 {
            font-size: 10px;
            margin: 2px 0;
            padding: 0;
        }
        .logo {
            max-width: 80px;
            margin-bottom: 5px;
        }
        .school-info {
            margin-bottom: 20px;
        }
        .student-info {
            margin-bottom: 10px;
            font-size: 8px;
        }
        .student-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .student-info th, .student-info td {
            border: 1px solid #ddd;
            padding: 3px 5px;
            text-align: left;
            font-size: 8px;
        }
        .student-info th {
            background-color: #f2f2f2;
            width: 30%;
        }
        .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 8px;
            page-break-inside: avoid;
        }
        .grades-table th, .grades-table td {
            border: 1px solid #ddd;
            padding: 3px 2px;
            text-align: center;
            font-size: 8px;
        }
        .grades-table th {
            background-color: #f2f2f2;
        }
        .summary {
            margin: 5px 0;
            padding: 5px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            font-size: 8px;
        }
        .footer {
            margin-top: 10px;
            text-align: center;
            font-size: 7px;
            color: #666;
        }
        .signature {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            font-size: 8px;
        }
        .signature div {
            width: 45%;
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 5px;
            margin-top: 10px;
        }
        .mention {
            font-weight: bold;
            text-align: center;
            margin: 5px 0;
            padding: 5px;
            background-color: #e9f7fe;
            border-left: 3px solid #1e88e5;
            font-size: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="school-info">
            <h1>RÉPUBLIQUE DU SÉNÉGAL</h1>
            <h2>Ministère de l'Éducation Nationale</h2>
            <h3>BULLETIN DE NOTES {{ strtoupper($bulletin->trimestre) }} TRIMESTRE</h3>
            <p>Année Scolaire: {{ $bulletin->anneeScolaire->annee }}</p>
        </div>
    </div>

    <div class="student-info">
        <table>
            <tr>
                <th>Nom</th>
                <td>{{ $bulletin->eleve->nom }}</td>
                <th>Prénom</th>
                <td>{{ $bulletin->eleve->prenom }}</td>
            </tr>
            <tr>
                <th>Date de Naissance</th>
                <td>{{ \Carbon\Carbon::parse($bulletin->eleve->date_naissance)->format('d/m/Y') }}</td>
                <th>Classe</th>
                <td>{{ $bulletin->eleve->classe->nom ?? 'Non spécifiée' }}</td>
            </tr>
            <tr>
                <th>Matricule</th>
                <td>Non renseigné</td>
                <th>Effectif de la classe</th>
                <td>{{ $bulletin->eleve->classe->eleves->count() ?? '?' }} élèves</td>
            </tr>
        </table>
    </div>

    <h3 style="font-size: 10px; margin: 5px 0; text-align: center;">RÉSULTATS SCOLAIRES</h3>
    <table class="grades-table">
        <thead>
            <tr>
                <th>MATIÈRES</th>
                <th>COEF</th>
                <th>NOTES</th>
                <th>MOY. CLASSE</th>
                <th>APPRÉCIATION</th>
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
                <p><strong>Rang:</strong> {{ $bulletin->rang }}<sup>e</sup>/{{ $bulletin->eleve->classe->eleves->count() ?? '?' }}</p>
            </div>
            <div>
                <p><strong>Mentions:</strong> {{ $bulletin->mention }}</p>
                <p><strong>Décision:</strong> {{ $bulletin->decision }}</p>
            </div>
        </div>
    </div>

    <div class="mention">
        <p><strong>APPRÉCIATION GÉNÉRALE:</strong> {{ $bulletin->appreciation }}</p>
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

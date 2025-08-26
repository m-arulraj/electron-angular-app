<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applications by Version</title>
    <style>
        /* Style to make tables appear attached to each other */
        .table-container {
            display: flex;
            justify-content: flex-start; /* Aligns tables next to each other */
        }

        table {
            border-collapse: collapse;
            width: 300px;
            margin: 0; /* Remove any space between tables */
        }

        table, th, td {
            border: 1px solid black;
        }

        th, td {
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <h2>Applications by Version</h2>

    <div class="table-container">
        <!-- Loop through each version and create a table for each -->
        <#list versions as version>
            <div>
                
                <table>
                    <thead>
                        <tr><th colspan="2">Version: ${version}</th></tr>
                        <tr>
                            <th>Application Name</th>
                            <th>Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Iterate over the applications and check if they support the version -->
                        <#list applications as app>
                            <#if version in app.versions>
                                <tr>
                                    <td>${app.name}</td> <!-- Application Name -->
                                    <td>${app.team}</td> <!-- Team -->
                                </tr>
                            </#if>
                        </#list>
                    </tbody>
                </table>
            </div>
        </#list>
    </div>

</body>

</html>

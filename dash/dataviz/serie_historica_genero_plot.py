from dash import dcc

def serie_historica_genero_plot(data):
    print(data)
    return dcc.Graph(
        figure={
            'data': [{'x': data.index, 'y': data[col], 'type': 'bar', 'name': col} for col in data.columns],
            'layout': {
                'title': 'Série Histórica de Notificações por Gênero',
                'xaxis': {
                    'title': 'Ano',
                    'tickmode': 'array',
                    'tickvals': data.index,
                    'ticktext': [str(a) for a in data.index],
                },
            },
        },
    )

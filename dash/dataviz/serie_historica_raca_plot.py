from dash import dcc


def serie_historica_raca_plot(data):
    return dcc.Graph(
        figure={
            'data': [{'x': data.index, 'y': data[col], 'type': 'bar', 'name': col} for col in data.columns],
            'layout': {
                'title': 'Série histórica de Raça/Cor',
                'xaxis': {
                    'title': 'Ano',
                    'tickmode': 'array',
                    'tickvals': data.index,
                    'ticktext': [str(a) for a in data.index],
                },
            },
        },
    )

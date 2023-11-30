from dash import dcc


def serie_historica_notif_plot(data):
    return dcc.Graph(
        figure={
            'data': [{'x': data['ano'], 'y': data['count'], 'type': 'bar', 'name': 'Série Histórica'}],
            'layout': {
                'title': 'Série histórica de Notificações',
                'xaxis': {
                    'title': 'Ano',
                    'tickmode': 'array',
                    'tickvals': data['ano'],
                    'ticktext': [str(a) for a in data['ano']],
                },
            },
        },
    )

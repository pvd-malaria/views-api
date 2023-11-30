import dash
from dash import dcc, html
from dash.dependencies import Input, Output

from dataviz.serie_historica_notif_plot import serie_historica_notif_plot
from dataviz.serie_historica_genero_plot import serie_historica_genero_plot
from dataviz.serie_historica_raca_plot import serie_historica_raca_plot
from dataviz.serie_historica_vivax_plot import serie_historica_vivax_plot
from dataviz.serie_historica_falciparum_plot import serie_historica_falciparum_plot

from load_data import load_data

APP_PORT = 9009
DEBUG = False

# Initialize the Dash app
app = dash.Dash(__name__, requests_pathname_prefix='/dash/')

# Define the options for the dropdown
dropdown_options = [
    {'label': 'Casos por ano', 'value': 'serie_hist_notif'},
    {'label': 'Série Histórica por Sexo', 'value': 'serie_hist_gender'},
    {'label': 'Série Histórica por Raça/Cor', 'value': 'serie_hist_raca'},
    {'label': 'Série Histórica por Vivax', 'value': 'serie_hist_vivax'},
    {'label': 'Série Histórica por Falciparum', 'value': 'serie_hist_falciparum'}
]

data_viz_list = [item['value'] for item in dropdown_options]

# Define the layout of the app
app.layout = html.Div(
    className="container-fluid",
    children=[
        html.Div(
            className="row",
            children=[
                # Left Section
                html.Div(
                    className="col-md-3 bg-light",
                    children=[
                        html.Div(
                            className="d-flex flex-column align-items-center mt-5",
                            children=[
                                dcc.Dropdown(id='dropdown', options=dropdown_options, value='serie_hist_notif', className="btn btn-primary btn-block")
                            ]
                        )
                    ]
                ),
                # Right Section
                html.Div(
                    className="col-md-9",
                    children=[
                        html.Div(id='graph-container')
                    ]
                )
            ]
        )
    ]
)

# Callback to load data when the dropdown value changes
@app.callback(
    Output('graph-container', 'children'),
    [Input('dropdown', 'value')]
)
def update_graph(dropdown_value):
    malaria_views = load_data(data_viz_list)
    if dropdown_value == 'serie_hist_notif':
        return serie_historica_notif_plot(malaria_views['serie_hist_notif'])
    elif dropdown_value == 'serie_hist_gender':
        return serie_historica_genero_plot(malaria_views['serie_hist_gender'])
    elif dropdown_value == 'serie_hist_raca':
        return serie_historica_raca_plot(malaria_views['serie_hist_raca'])
    elif dropdown_value == 'serie_hist_vivax':
        return serie_historica_vivax_plot(malaria_views['serie_hist_vivax'])
    elif dropdown_value == 'serie_hist_falciparum':
        return serie_historica_falciparum_plot(malaria_views['serie_hist_falciparum'])
    else:
        return serie_historica_notif_plot(malaria_views['serie_hist_notif'])

if __name__ == '__main__':
    app.run(host='promalaria-dash', port=APP_PORT, debug=DEBUG)

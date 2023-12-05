import pandas as pd
import glob
import os
from dotenv import load_dotenv
load_dotenv()

VIEWS_ADDRESS = os.environ.get('VIEWS_ADDRESS', 'http://promalaria-views-api:9000')

# Function to load data and calculate the initial graphs
def load_data(data_viz_list):
    malaria_views = {}
    for malaria_viz in data_viz_list:
        malaria_views[malaria_viz] = pd.read_csv('{}/fetch/'.format(VIEWS_ADDRESS) + malaria_viz.split('_')[-1])
        if 'variable' in malaria_views[malaria_viz].columns:
            malaria_views[malaria_viz] = malaria_views[malaria_viz].pivot_table(index='ano', columns='variable', values='count', aggfunc='sum')
    return malaria_views


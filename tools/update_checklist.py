import argparse
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials


def get_sheet(key_file, sheet_name, worksheet):
    """
    Append a row to the google sheet.

    :param key_file: key file to use for auth
    :param sheet_name: the name of the sheet
    :param worksheet: the name of the worksheet
    :param row: the row to append
    """
    print('Authorizing gspread...')
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    credentials = ServiceAccountCredentials.from_json_keyfile_name(key_file, scope)
    gc = gspread.authorize(credentials)

    return gc.open(sheet_name).worksheet(worksheet)


def append_rows(sheet, values, value_input_option='RAW'):
    """Adds multiple rows to the worksheet with values populated.
    The input should be a list of lists, with the lists each
    containing one row's values.
    Widens the worksheet if there are more values than columns.
    :param values: List of row lists.
    """
    params = {
        'valueInputOption': value_input_option
    }

    body = {
        'majorDimension': 'ROWS',
        'values': values
    }

    return sheet.spreadsheet.values_append(sheet.title, params, body)


parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', type=str, required=True)
parser.add_argument('-k', '--key-file', type=str, required=True)
args = parser.parse_args()

items_df = pd.read_csv(args.input, encoding='ISO-8859-1', header=None, names=['id', 'type', 'product', 'name'])
items_df['product'] = items_df['product'].str.replace('Product_TA ProductsDB.Products.', '')

sheet = get_sheet(args.key_file, 'rl-loadout', 'Items')

ids = set(map(int, sheet.col_values(1)[1:]))

rows_to_add = []

for index, row in items_df.iterrows():
    if int(row['id']) in ids:
        continue

    rows_to_add.append([row['id'], row['type'], row['product'], row['name'], 'FALSE'])

append_rows(sheet, rows_to_add, 'USER_ENTERED')

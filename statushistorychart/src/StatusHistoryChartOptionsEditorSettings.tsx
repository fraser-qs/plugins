// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { LegendOptionsEditor, LegendOptionsEditorProps } from '@perses-dev/plugin-system';
import { produce } from 'immer';
import {
  OptionsEditorGroup,
  OptionsEditorGrid,
  OptionsEditorColumn,
  OptionsEditorControl,
  SortSelector,
  SortOption,
  SortSelectorProps,
} from '@perses-dev/components';
import { Button, Switch, TextField } from '@mui/material';
import { ChangeEvent, ReactElement } from 'react';
import { StatusHistoryChartOptions, StatusHistroyChartEditorProps } from './status-history-model.js';

export function StatusHistoryChartOptionsEditorSettings(props: StatusHistroyChartEditorProps): ReactElement {
  const { onChange, value } = props;

  const handleLegendChange: LegendOptionsEditorProps['onChange'] = (newLegend) => {
    // TODO (sjcobb): fix type, add position, fix glitch
    onChange(
      produce(value, (draft: StatusHistoryChartOptions) => {
        draft.legend = newLegend;
      })
    );
  };

  const handleSortChange: SortSelectorProps['onChange'] = (newSort: SortOption) => {
    onChange(
      produce(value, (draft: StatusHistoryChartOptions) => {
        draft.sorting = newSort;
      })
    );
  };

  return (
    <OptionsEditorGrid>
      <OptionsEditorColumn>
        <LegendOptionsEditor
          calculation="aggregation"
          showValuesEditor={false}
          value={value.legend}
          onChange={handleLegendChange}
        />
        <OptionsEditorGroup title="Visual">
          <SortSelector value={value.sorting} onChange={handleSortChange} />
          <OptionsEditorControl
            label="Auto Row Height"
            control={
              <Switch
                checked={value.rowHeight === undefined || value.rowHeight === 'auto'}
                onChange={(_: ChangeEvent, checked: boolean) => {
                  onChange(
                    produce(value, (draft: StatusHistoryChartOptions) => {
                      draft.rowHeight = checked ? 'auto' : 40;
                    })
                  );
                }}
              />
            }
          />
          {typeof value.rowHeight === 'number' && (
            <OptionsEditorControl
              label="Row Height"
              control={
                <TextField
                  type="number"
                  value={value.rowHeight}
                  slotProps={{ input: { inputProps: { min: 1, step: 1 } } }}
                  onChange={(e) => {
                    onChange(
                      produce(value, (draft: StatusHistoryChartOptions) => {
                        draft.rowHeight = parseInt(e.target.value) || 40;
                      })
                    );
                  }}
                />
              }
            />
          )}
        </OptionsEditorGroup>
      </OptionsEditorColumn>
      <OptionsEditorColumn>
        <OptionsEditorGroup title="Reset Settings">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              onChange(
                produce(value, (draft: StatusHistoryChartOptions) => {
                  // reset button removes all optional panel options
                  draft.legend = undefined;
                })
              );
            }}
          >
            Reset To Defaults
          </Button>
        </OptionsEditorGroup>
      </OptionsEditorColumn>
    </OptionsEditorGrid>
  );
}

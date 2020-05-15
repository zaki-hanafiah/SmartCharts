import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Scrollbars from 'tt-react-custom-scrollbars';
import {
    FormGroup,
    Switch,
    NumericInput,
    ColorPicker,
    Slider,
    Pattern,
    DropDown,
    NumberColorPicker,
    FontSetting,
} from './Form.jsx';
import { DeleteIcon } from './Icons.jsx';
import '../../sass/components/settings-dialog.scss';

const SettingsPanelItem = ({ group, title, type, Field }) => (
    <FormGroup
        title={
            (type === 'select'
                     || type === 'pattern'
                     || type === 'colorpicker'
                     || type === 'numbercolorpicker'
                     || group === 'OverBought'
                     || group === 'OverSold'
            ) ? null : title
        }
        type={type}
    >
        {Field}
    </FormGroup>
);

const SettingsPanelGroup = ({
    title,
    items, // [{ id, title, value, defaultValue, type }]
    theme,
    onItemChange,
}) => {
    const renderMap = {
        switch: item => (
            <Switch
                value={item.value}
                onChange={v => onItemChange(item.id, v)}
            />
        ),
        colorpicker: item => (
            <ColorPicker
                theme={theme}
                color={item.value}
                subtitle={item.subtitle || item.title}
                setColor={value => onItemChange(item.id, value)}
            />
        ),
        pattern: (item) => {
            const lineWidth = items.find(it => it.id === 'lineWidth').value;
            return (
                <Pattern
                    pattern={item.value}
                    lineWidth={lineWidth}
                    subtitle={item.title}
                    onChange={(v) => {
                        onItemChange('pattern', v.pattern);
                        onItemChange('lineWidth', v.width);
                    }}
                />
            );
        },
        select: item => (
            <DropDown
                rows={Object.keys(item.options)}
                value={item.value}
                subtitle={item.subtitle || item.title}
                onRowClick={value => onItemChange(item.id, value)}
            >
                {row => row}
            </DropDown>
        ),
        number: item => (
            <Slider
                min={item.min || 1}
                step={item.step || 1}
                max={item.max || 100}
                value={item.value}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
        numericinput: item => (
            <span className="ciq-num-input">
                <NumericInput
                    value={item.value}
                    onChange={val => onItemChange(item.id, val)}
                    min={item.min}
                    step={item.step}
                    max={item.max}
                />
            </span>
        ),
        numbercolorpicker: item => (
            <NumberColorPicker
                value={item.value}
                theme={theme}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
        font: item => (
            <FontSetting
                value={item.value}
                onChange={val => onItemChange(item.id, val)}
            />
        ),
    };

    const input_group_name = `form__input-group--${(title || '').toLowerCase().replace(' ', '-')}`;

    return (
        <div className={`form__input-group ${input_group_name}`}>
            {title === 'Show Zones' ? '' : (<h4>{title}</h4>)}
            {items.map(item => (renderMap[item.type]
                    && (
                        <SettingsPanelItem
                            key={item.id}
                            type={item.type}
                            active={item.active}
                            title={title === 'Show Zones' ? item.title : item.title.replace(title, '')}
                            Field={renderMap[item.type](item)}
                        />
                    )
            ))}
        </div>
    );
};

const SettingsPanel = ({
    itemGroups,
    theme,
    onItemChange,
    setScrollPanel,
}) => (
    <Scrollbars
        className="sc-scrollbar form form--indicator-setting"
        ref={setScrollPanel}
        autoHide
    >
        {itemGroups.map(group => (
            (group.fields.length > 0)
            && (
                <SettingsPanelGroup
                    key={group.key}
                    group={group.key}
                    title={group.key}
                    items={group.fields}
                    theme={theme}
                    onItemChange={onItemChange}
                />
            )
        ))}
    </Scrollbars>
);

const ResetButton = ({ onClick }) => (
    <button
        type="button"
        className="sc-btn sc-btn--outline-secondary sc-btn--reset"
        onClick={onClick}
    >{t.translate('Reset')}
    </button>
);

const DoneButton = ({ onClick }) => (
    <button
        type="button"
        className="sc-btn sc-btn--primary sc-btn--save"
        onClick={() => onClick()}
    >{t.translate('Done')}
    </button>
);

const SettingsDialog = ({
    itemGroups,
    title,
    description,
    showTabs,
    onResetClick,
    onItemChange,
    onItemDelete,
    SettingDialogMenu,
    theme,
    close,
    setScrollPanel,
    dialogPortalNodeId,
}) => (
    <SettingDialogMenu
        className="cq-modal--settings"
        title={title}
        newStyle
        enableTabular={showTabs}
        emptyMenu
        enableOverlay // this temprary, we remove it when all menus convert to modal
        portalNodeId={dialogPortalNodeId}
    >
        <SettingDialogMenu.Title />
        <SettingDialogMenu.Body>
            <div className="cq-chart-settings">
                {showTabs
                    ? (
                        <Tabs className="tabs--vertical">
                            <TabList>
                                <Tab>Settings</Tab>
                                <Tab>Description</Tab>
                            </TabList>
                            <TabPanel>
                                <SettingsPanel
                                    itemGroups={itemGroups}
                                    theme={theme}
                                    onItemChange={onItemChange}
                                    setScrollPanel={setScrollPanel}
                                />
                                <div className="buttons">
                                    <ResetButton onClick={onResetClick} />
                                    <DoneButton onClick={close} />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                {description}
                            </TabPanel>
                        </Tabs>
                    ) : (
                        <>
                            <SettingsPanel
                                itemGroups={itemGroups}
                                theme={theme}
                                onItemChange={onItemChange}
                                setScrollPanel={setScrollPanel}
                            />
                            <div className="buttons">
                                <DeleteIcon
                                    className="sc-btn--delete"
                                    onClick={onItemDelete}
                                />
                                <div>
                                    <ResetButton onClick={onResetClick} />
                                    <DoneButton onClick={close} />
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </SettingDialogMenu.Body>
    </SettingDialogMenu>
);
export default SettingsDialog;

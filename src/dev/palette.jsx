import React from 'react';
import {
    Category,
    Component,
    Variant,
    Palette,
} from '@react-buddy/ide-toolbox';

export const PaletteTree = () => (
    <Palette>
        <Category name="App">
            <Component name="Loader">
                <Variant>
                    <div className="loader">Loading...</div>
                </Variant>
            </Component>
        </Category>
    </Palette>
);
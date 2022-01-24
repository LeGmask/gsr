import { MdOutlineSave } from 'react-icons/md';

import { useEffect, useRef, useState } from 'react';

import './SheetIdManager.scss';

const writeLocalStorage = (id: string) => {
	localStorage.setItem('sheetId', id);
};

export interface ISheetIdProps {
	updateSheetId: Function;
}

export function SheetIdManager({ updateSheetId }: ISheetIdProps) {
	const [sheetId, setSheetId] = useState(localStorage.getItem('sheetId') || '');
	const [sheetIdInput, setSheetIdInput] = useState(sheetId);

	const handleSave = () => {
		setSheetId(sheetIdInput);
		writeLocalStorage(sheetIdInput);
		updateSheetId();
	};

	return (
		<div className="sheetIdManager_container">
			<h3 className="h3_helper">Step 1 ‒ Input the google spreadsheet id:</h3>
			<div className="sheetIdManager_area">
				<div className="input-field">
					<input
						type="text"
						placeholder="Spreadsheet id, found after 'spreadsheets/d/'"
						value={sheetIdInput}
						onChange={(e) => setSheetIdInput(e.target.value)}
					/>
				</div>
				{sheetIdInput !== sheetId ? (
					<a className="sheetIdManager_control new" onClick={handleSave}>
						<MdOutlineSave />
					</a>
				) : null}
			</div>
		</div>
	);
}

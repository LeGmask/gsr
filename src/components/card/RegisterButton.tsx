import { useState } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';
import { IoWarningOutline } from 'react-icons/io5';

export enum State {
	Regular = 'regular',
	Warning = 'warning',
	Error = 'error',
}

export interface IRegisterButtonProps extends React.HTMLAttributes<HTMLDivElement> {
	state?: State;
}

export function RegisterButton({ state = State.Regular, ...rest }: IRegisterButtonProps) {
	// state = state ? state : State.Regular

	switch (state) {
		case State.Regular: {
			return (
				<div className="card_options_item_control regular" {...rest}>
					<AiOutlinePlus />
				</div>
			);
		}
		case State.Warning: {
			return (
				<div className="card_options_item_control warning" {...rest}>
					<AiOutlinePlus />
				</div>
			);
		}
		case State.Error: {
			return (
				<div className="card_options_item_control error" {...rest}>
					<IoWarningOutline />
				</div>
			);
		}
	}
}

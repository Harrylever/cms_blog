import React, {useRef, useState, useEffect} from 'react';

import {submitComment} from '../services';
import {type CommentObj} from '../types';

const CommentsForm = ({slug}: {slug: string}) => {
	const [error, setError] = useState(false);
	const [localStorage, setlocalStorage] = useState(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const commentEl = useRef<HTMLTextAreaElement>(null);
	const nameEl = useRef<HTMLInputElement>(null);
	const emailEl = useRef<HTMLInputElement>(null);
	const storeDataEl = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const nameVal = window.localStorage.getItem('name');
		const emailVal = window.localStorage.getItem('email');

		if (nameEl.current !== null && emailEl.current !== null) {
			nameEl.current.value = typeof nameVal === 'string' ? nameVal : '';
			emailEl.current.value = typeof emailVal === 'string' ? emailVal : '';
		} else {
			console.error('They were Null');
		}
	}, []);

	const handleCommentSubmission = () => {
		setError(false);

		const {value: comment} = commentEl.current!;
		const {value: name} = nameEl.current!;
		const {value: email} = emailEl.current!;
		const {checked: storeData} = storeDataEl.current!;

		if (!comment || !name || !email) {
			setError(true);
			return '';
		}

		const commentObj: CommentObj = {name, email, comment, slug};

		if (storeData) {
			window.localStorage.setItem('name', name);
			window.localStorage.setItem('email', email);
		} else {
			window.localStorage.removeItem('name');
			window.localStorage.removeItem('email');
		}

		submitComment(commentObj)
			.then(res => {
				console.log(res);
				setShowSuccessMessage(true);
				setTimeout(() => {
					setShowSuccessMessage(false);
				}, 3000);
			})
			.catch(err => {
				console.error(err);
			});
	};

	return (
		<div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
			<h3 className='text-xl mb-8 font-semibold border-b pb-4'>Leave a Reply</h3>
			<div className='grid grid-cols-1 gap-4 mb-4'>
				<textarea
					ref={commentEl}
					className='p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-grey-200 bg-gray-100 text-gray-700'
					placeholder='Comment'
					name='comment'
				/>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
				<input
					type='text'
					ref={nameEl}
					className='py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-grey-200 bg-gray-100 text-gray-700'
					placeholder='Name'
					name='name'
				/>
				<input
					type='text'
					ref={emailEl}
					className='p-4 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-grey-200 bg-gray-100 text-gray-700'
					placeholder='Email'
					name='email'
				/>
			</div>
			<div className='grid grid-cols-1 gap-4 mb-4'>
				<div>
					<input type='checkbox' ref={storeDataEl} id='storeData' name='storeData' />
					<label className='text-gray-500 cursor-pointer ml-2' htmlFor='storeData'>Save my e-mail and name for the next time I comment.</label>
				</div>
			</div>
			{error && <p className='text-xs text-red-500'>All fields are required.</p>}
			<div className='mt-8'>
				<button
					type='button'
					className='transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg rounded-full text-white px-8 py-3 cursor-pointer'
					onClick={handleCommentSubmission}>Post Comment</button>
				{showSuccessMessage && <span className='text-xl float-right font-semibold mt-3 text-green-500'>Committed submitted for review</span>}
			</div>
		</div>
	);
};

export default CommentsForm;

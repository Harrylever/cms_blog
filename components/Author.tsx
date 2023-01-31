import React from 'react';
import {type PostAuthor} from '../types';
import Image from 'next/image';

const Author = ({author}: {author: PostAuthor | undefined}) => (
	<div className='text-center mt-16 mb-8 p-12 relative rounded-lg bg-black bg-opacity-20'>
		<div className='absolute left-0 right-0 -top-14'>
			<Image
				src={typeof author?.photo.url === 'string' ? author?.photo.url : ''}
				alt={typeof author?.name === 'string' ? author?.name : ''}
				width={'95'}
				height={'95'}
				style={{maxWidth: '95px', minHeight: '95px', maxHeight: '95px'}}
				className='align-middle rounded-full'
			/>
		</div>
		<h3 className='text-white my-4 text-xl font-bold'>{author?.name}</h3>
		<p className='text-white text-lg'>{author?.bio}</p>
	</div>
);

export default Author;

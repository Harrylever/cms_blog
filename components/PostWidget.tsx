import React, {useState, useEffect} from 'react';
import moment from 'moment';
import Link from 'next/link';

import {getRecentPosts, getSimilarPosts} from '../services';
import {type PostNode} from '../types';

const PostWidget = ({categories, slug}: {categories?: string[] | undefined; slug?: string | undefined}) => {
	const [relatedPosts, setRelatedPosts] = useState<PostNode[]>([]);

	useEffect(() => {
		if (slug) {
			getSimilarPosts(typeof categories === 'object' ? categories : [], slug)
				.then(result => {
					const postResults = result.posts;
					setRelatedPosts(postResults);
				})
				.catch(err => {
					console.error(err);
				});
		} else {
			getRecentPosts()
				.then(result => {
					const postResults = result.posts;
					setRelatedPosts(postResults);
				})
				.catch(err => {
					console.error(err);
				});
		}
	}, [slug]);

	return (
		<div className='bg-white shadow-lg rounded-lg p-8 mb-8 '>
			<h3 className='text-xl mb-8 font-semibold border-b pb-4'>
				{slug ? 'Related Posts' : 'Recent Posts'}
			</h3>
			{
				relatedPosts.map(post => (
					<div key={post.title} className='flex items-center w-full mb-4'>
						<div className='w-16 flex-none'>
							<img
								src={post.featuredImage.url}
								alt={post.title}
								height='60px'
								width='60px'
								style={{minWidth: '60px', maxWidth: '60px', minHeight: '60px', maxHeight: '60px'}}
								className='align-middle rounded-full'
							/>
						</div>
						<div className='flex-grow ml-4'>
							<p className='text-gray-500 text-sm'>{moment(post.createdAt).format('MMM DD, YYYY')}</p>
							<Link href={`/post/${post.slug}`} className='text-md font-medium'>{post.title}</Link>
						</div>
					</div>
				))
			}
		</div>
	);
};

export default PostWidget;

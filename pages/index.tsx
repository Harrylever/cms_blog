import React from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {PostCard, CategoryPage, PostWidget} from '../components';
import {type Post} from '../types';
import {getPosts} from '../services';
import {FeaturedPosts} from '../sections';

const Home = ({posts}: {posts: Post[]}) => (
	<div className='container mx-auto px-15 lg:px-25 mb-8'>
		<Head>
			<title>CMS Blog</title>
			<link rel='icon' href='/favicon.ico' />
		</Head>

		<FeaturedPosts />
		<div className='grid grid-cols-1 lg:grid-cols-12 gap-12 px-5'>
			<div className='lg:col-span-8 col-span-1'>
				{posts.map(post => (
					<PostCard key={post.node.title} post={post} />
				))}
			</div>
			<div className='lg:col-span-4 col-span-1'>
				<div className='lg:sticky relative top-8'>
					<PostWidget />
					<CategoryPage />
				</div>
			</div>
		</div>
	</div>
);

export async function getStaticProps() {
	const posts = (await getPosts()) || [];
	return {
		props: {posts},
	};
}

export default Home;

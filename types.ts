export type CommentObj = {
	name: string;
	email: string;
	comment: string;
	slug: string;
	createdAt: string;
};

export type Category = {
	name: string;
	slug: string;
};

type AuthorPhoto = {
	url: string;
};

type PostFeaturedImage = {
	url: string;
};

export type PostAuthor = {
	bio: string;
	name: string;
	id: string;
	photo: AuthorPhoto;
};

export type PostNode = {
	author?: PostAuthor;
	createdAt: string;
	slug: string;
	title: string;
	excerpt?: string;
	featuredImage: PostFeaturedImage;
	categories?: Category[];
	content?: {
		raw: {
			children: any[];
		};
	};
};

export type Post = {
	node: PostNode;
};

export type PostResult = {
	postsConnection: {
		edges: Post[];
	};
};

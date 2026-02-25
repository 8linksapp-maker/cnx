import type { APIRoute } from 'astro';
import { listAuthors } from '../../../../utils/author-utils';
import { verifyPassword, createSession, SESSION_COOKIE, COOKIE_OPTIONS } from '../../../../utils/auth-utils';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const form = await request.formData();
    const email    = (form.get('email')    as string || '').trim().toLowerCase();
    const password = (form.get('password') as string || '');

    if (!email || !password) {
        return redirect('/admin/login?error=invalid');
    }

    const authors = await listAuthors();
    const author = authors.find(
        a => a.data.email?.toLowerCase() === email &&
             (a.data.adminRole === 'admin' || a.data.adminRole === 'editor')
    );

    if (!author) return redirect('/admin/login?error=invalid');
    if (!author.data.adminPasswordHash) return redirect('/admin/login?error=inactive');
    if (!verifyPassword(password, author.data.adminPasswordHash)) {
        return redirect('/admin/login?error=invalid');
    }

    const token = createSession({
        slug: author.data.slug,
        name: author.data.name,
        adminRole: author.data.adminRole as 'admin' | 'editor',
    });

    cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
    return redirect('/admin');
};

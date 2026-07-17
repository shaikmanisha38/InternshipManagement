import { Logger } from '@nestjs/common';

export class GithubApiUtil {
  private static readonly logger = new Logger(GithubApiUtil.name);

  /**
   * Wrapper for making robust requests to GitHub API.
   * Handles 401, 404, rate limits gracefully.
   */
  static async request(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(options.headers || {})
        }
      });

      // Handle Rate Limiting
      if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        this.logger.warn(`GitHub API Rate Limit Exceeded for URL: ${url}`);
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }

      // Handle Unauthorized
      if (response.status === 401) {
        this.logger.warn(`GitHub API Unauthorized for URL: ${url}`);
        throw new Error('GitHub token is invalid or expired.');
      }

      // Handle Not Found
      if (response.status === 404) {
        this.logger.warn(`GitHub Resource Not Found: ${url}`);
        throw new Error('Invalid commit hash or private repository access denied.');
      }

      // Handle other non-ok statuses
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`GitHub API Error (${response.status}) on ${url}: ${errorText}`);
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      // Return parsed JSON
      return await response.json();
    } catch (error: any) {
      this.logger.error(`GitHub API fetch failed for ${url}: ${error.message}`);
      // Re-throw to be handled by the caller or global exception filter
      throw error;
    }
  }

  /**
   * Helper to normalize repository URLs (e.g., stripping .git or trailing slashes).
   * Example: https://github.com/user/repo.git -> user/repo
   */
  static extractOwnerAndRepo(repoUrl: string): { owner: string; repo: string } {
    let cleanUrl = repoUrl.trim();
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    if (cleanUrl.endsWith('.git')) {
      cleanUrl = cleanUrl.slice(0, -4);
    }

    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
    if (!match) {
      throw new Error('Invalid GitHub repository URL format.');
    }

    return {
      owner: match[1],
      repo: match[2]
    };
  }
}

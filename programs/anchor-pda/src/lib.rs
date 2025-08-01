use anchor_lang::prelude::*;

declare_id!("31eZZ9mrMAPHM3nbrWrohDwqSAkG9YBPZQYzzBfwGFuQ");

#[program]
pub mod anchor_pda {
    use super::*;

    pub fn create_user_account(ctx: Context<CreateUserAccount>, name: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        require!(name.len() < 32, CustomError::NameTooLong);
        user_account.name = name;
        user_account.point = 0;
        user_account.owner = ctx.accounts.user.key();
        Ok(())
    }

    pub fn add_points(ctx: Context<AddPoints>, points: u32) -> Result<()> {
        require!(points > 0, CustomError::PointsCannotBeZero);
        let user_account = &mut ctx.accounts.user_account;
        user_account.point += points;
        msg!("Added {} points. Total: {}", points, user_account.point);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateUserAccount<'info> {
    #[account(
        init,
        payer= user,
        space = UserAccount::LEN,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddPoints<'info> {
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump,
        has_one = owner
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: this is validated by the has_one constraint
    pub owner: AccountInfo<'info>,
}

#[account]
pub struct UserAccount {
    pub name: String,  // 4 + 32 bytes... max chars
    pub point: u32,    // 4 bytes
    pub owner: Pubkey, // 32 bytes
}

impl UserAccount {
    pub const LEN: usize = 8 + 4 + 32 + 4 + 32;
}

#[error_code]
pub enum CustomError {
    #[msg("Points must be greater than zero.")]
    PointsCannotBeZero,

    #[msg("Name must be 32 characters or fewer.")]
    NameTooLong,
}


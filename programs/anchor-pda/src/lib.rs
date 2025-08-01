use anchor_lang::prelude::*;

declare_id!("31eZZ9mrMAPHM3nbrWrohDwqSAkG9YBPZQYzzBfwGFuQ");

#[program]
pub mod anchor_pda {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

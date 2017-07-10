﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWord.DataAccess;
using WatchWord.DataAccess.Repositories;
using WatchWord.Domain.Entity;

namespace WatchWord.Service
{
    public class VocabularyService : IVocabularyService
    {
        private readonly IWatchWordUnitOfWork unitOfWork;
        private readonly IAccountsService accountsService;
        private readonly IVocabWordsRepository vocabWordsRepository;

        /// <summary>Prevents a default instance of the <see cref="VocabularyService"/> class from being created.</summary>
        private VocabularyService() { }

        /// <summary>Initializes a new instance of the <see cref="VocabularyService"/> class.</summary>
        /// <param name="watchWordUnitOfWork">Unit of work over WatchWord repositories.</param>
        /// <param name="accountsService">Accounts service.</param>
        public VocabularyService(IWatchWordUnitOfWork unitOfWork, IAccountsService accountsService)
        {
            this.unitOfWork = unitOfWork;
            this.accountsService = accountsService;
            vocabWordsRepository = unitOfWork.Repository<IVocabWordsRepository>();
        }

        public async Task<List<VocabWord>> GetVocabWordsAsync(int userId)
        {
            var account = await accountsService.GetByExternalIdAsync(userId);
            return await vocabWordsRepository.GetAllAsync(l => l.Owner.Id == account.Id);
        }

        public async Task<int> InsertVocabWordAsync(VocabWord vocabWord, int userId)
        {
            var owner = await accountsService.GetByExternalIdAsync(userId);
            vocabWord.Owner = owner;

            if (await vocabWordsRepository.GetById(vocabWord.Id) != null)
            {
                vocabWordsRepository.Update(vocabWord);
            }
            else
            {
                vocabWordsRepository.Insert(vocabWord);
            }

            return await unitOfWork.SaveAsync();
        }

        public async Task<List<VocabWord>> GetVocabByMaterialWordsAsync(string[] materialWords, int userId)
        {
            var owner = await accountsService.GetByExternalIdAsync(userId);
            var vocabWords = await vocabWordsRepository.GetAllAsync(v => v.Owner.Id == owner.Id && materialWords.Contains(v.Word));

            return vocabWords;
        }
    }
}
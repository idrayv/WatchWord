﻿using Abp.Domain.Entities;

namespace WatchWord.Entities
{
    /// <summary>Word statistic.</summary>
    public class WordStatistic : Entity<long>
    {
        /// <summary>Gets or sets word.</summary>
        public string Word { get; set; }

        /// <summary>Gets or sets total count of word within all materials.</summary>
        public int TotalCount { get; set; }

        /// <summary>Gets or sets total count of word within user known words vocabs.</summary>
        public int KnownCount { get; set; }

        /// <summary>Gets or sets total count of word within user learn words vocabs.</summary>
        public int LearnCount { get; set; }
    }
}
